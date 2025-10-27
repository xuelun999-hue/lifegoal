'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hand, Eye, Star, Triangle } from 'lucide-react';
import type { DetailedPalmFeatures } from '@/types';

interface DetailedPalmFeaturesProps {
  features: DetailedPalmFeatures;
}

export function DetailedPalmFeatures({ features }: DetailedPalmFeaturesProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = (section: string) => {
    const icons = {
      overview: <Hand className="w-4 h-4" />,
      lines: <Eye className="w-4 h-4" />,
      fingers: <Hand className="w-4 h-4" />,
      mounts: <Triangle className="w-4 h-4" />,
      special: <Star className="w-4 h-4" />
    };
    return icons[section as keyof typeof icons] || <ChevronRight className="w-4 h-4" />;
  };

  const translatePalmShape = (shape: string) => {
    const translations = {
      'square': '方形手',
      'rectangular': '長方形手', 
      'spatulate': '鏟形手',
      'conic': '圓錐形手',
      'psychic': '尖形手'
    };
    return translations[shape as keyof typeof translations] || shape;
  };

  const translateDepth = (depth: string) => {
    const translations = {
      'shallow': '淺',
      'medium': '中等',
      'deep': '深'
    };
    return translations[depth as keyof typeof translations] || depth;
  };

  const translateCurvature = (curvature: string) => {
    const translations = {
      'straight': '直線',
      'slight': '微彎',
      'moderate': '中度彎曲',
      'wide': '大幅彎曲'
    };
    return translations[curvature as keyof typeof translations] || curvature;
  };

  const translateEndPoint = (endPoint: string) => {
    const translations = {
      'under_index_finger': '食指下方',
      'between_index_middle': '食指與中指之間',
      'under_middle_finger': '中指下方',
      'above_middle_finger': '中指上方'
    };
    return translations[endPoint as keyof typeof translations] || endPoint;
  };

  const SectionHeader = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {getSectionIcon(section)}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {expandedSections.has(section) ? 
          <ChevronDown className="w-4 h-4 text-gray-500" /> : 
          <ChevronRight className="w-4 h-4 text-gray-500" />
        }
      </button>
      {expandedSections.has(section) && (
        <div className="mt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const FeatureItem = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 text-sm">{label}:</span>
      <span className={`font-medium text-sm ${color || 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </span>
    </div>
  );

  const LineFeatureCard = ({ 
    title, 
    feature, 
    color 
  }: { 
    title: string; 
    feature: any; 
    color: string;
  }) => (
    <div className="border rounded-lg p-4 bg-white">
      <h4 className="font-semibold mb-3 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
        {title}
      </h4>
      <div className="space-y-1">
        <FeatureItem label="長度比例" value={`${(feature.length_ratio * 100).toFixed(0)}%`} />
        <FeatureItem label="深度" value={translateDepth(feature.depth)} />
        <FeatureItem label="彎曲度" value={translateCurvature(feature.curvature)} />
        <FeatureItem label="清晰度" value={feature.clarity} />
        <FeatureItem label="顏色" value={feature.color} />
        <FeatureItem label="中斷數" value={feature.interruptions} />
        <FeatureItem label="分支數" value={feature.branches} />
        {feature.end_point && (
          <FeatureItem label="終點" value={translateEndPoint(feature.end_point)} />
        )}
        {feature.start_separation_head_line !== undefined && (
          <FeatureItem label="與智慧線距離" value={`${(feature.start_separation_head_line * 100).toFixed(0)}%`} />
        )}
      </div>
    </div>
  );

  const FingerCard = ({ title, feature }: { title: string; feature: any }) => (
    <div className="border rounded-lg p-3 bg-white">
      <h5 className="font-medium mb-2">{title}</h5>
      <div className="space-y-1 text-sm">
        <FeatureItem label="長度比" value={`${(feature.length_ratio * 100).toFixed(0)}%`} />
        <FeatureItem label="粗細" value={feature.thickness} />
        <FeatureItem label="柔韌性" value={feature.flexibility} />
        <FeatureItem label="指甲形狀" value={feature.nail_shape} />
        <FeatureItem label="指甲顏色" value={feature.nail_color} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="手掌基本特徵" section="overview">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FeatureItem label="手型" value={translatePalmShape(features.palm_shape)} color="text-emerald-600" />
            <FeatureItem label="大小" value={features.palm_size} />
            <FeatureItem label="質感" value={features.palm_texture} />
            <FeatureItem label="顏色" value={features.palm_color} />
          </div>
        </div>
      </SectionHeader>

      <SectionHeader title="主要掌紋線分析" section="lines">
        <div className="space-y-4">
          <LineFeatureCard 
            title="生命線" 
            feature={features.life_line} 
            color="#dc2626" 
          />
          <LineFeatureCard 
            title="感情線" 
            feature={features.heart_line} 
            color="#ec4899" 
          />
          <LineFeatureCard 
            title="智慧線" 
            feature={features.head_line} 
            color="#2563eb" 
          />
          {features.fate_line && (
            <LineFeatureCard 
              title="事業線" 
              feature={features.fate_line} 
              color="#7c3aed" 
            />
          )}
        </div>
      </SectionHeader>

      <SectionHeader title="手指特徵分析" section="fingers">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <FingerCard title="拇指" feature={features.thumb} />
          <FingerCard title="食指" feature={features.index_finger} />
          <FingerCard title="中指" feature={features.middle_finger} />
          <FingerCard title="無名指" feature={features.ring_finger} />
          <FingerCard title="小指" feature={features.pinky_finger} />
        </div>
      </SectionHeader>

      <SectionHeader title="手掌丘陵" section="mounts">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(features.mounts).map(([name, mount]) => (
            <div key={name} className="border rounded-lg p-3 bg-white">
              <h5 className="font-medium mb-2 capitalize">{name}丘</h5>
              <div className="space-y-1 text-sm">
                <FeatureItem label="隆起度" value={mount.prominence.toFixed(1)} />
                <FeatureItem label="質感" value={mount.texture} />
              </div>
            </div>
          ))}
        </div>
      </SectionHeader>

      {features.special_marks && features.special_marks.length > 0 && (
        <SectionHeader title="特殊記號" section="special">
          <div className="space-y-2">
            {features.special_marks.map((mark, index) => (
              <div key={index} className="border rounded-lg p-3 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">{mark.type}</span>
                  </div>
                  <span className="text-sm text-yellow-600">{mark.location}</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">{mark.meaning}</p>
              </div>
            ))}
          </div>
        </SectionHeader>
      )}
    </div>
  );
}